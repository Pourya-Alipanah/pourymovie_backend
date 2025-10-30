import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoLink } from '../video-link.entity';
import { Repository } from 'typeorm';
import { CreateVideoLinkRequestDto } from '../dtos/request/create-video-link.dto';
import { UploadFromEntity } from 'src/upload-center/enums/upload-from-entity.enum';
import { UploadType } from 'src/upload-center/enums/upload-type.enum';
import { UploadCenterService } from 'src/upload-center/providers/upload-center.service';
import {
  CONFLICT_EPISODE_EXIST_ERROR,
  CONFLICT_TITLE_EXIST_ERROR,
  VIDEO_LINK_NOT_FOUND_ERROR,
} from '../constants/video-link.errors.constant';
import { UpdateVideoLinkRequestDto } from '../dtos/request/update-video-link.dto';
import { CreateMultipleVideoLinkRequestDto } from '../dtos/request/create-multiple-video-link.dto';
import { TitlesService } from 'src/titles/titles.service';
import { EpisodeService } from 'src/episode/providers/episode.service';

/**
 * Service for managing video links.
 * This service provides methods to create, update, retrieve, and delete video links.
 * It interacts with the database through the VideoLink entity and uses the UploadCenterService
 * to handle video uploads.
 */
@Injectable()
export class VideoLinkService {
  /**
   * Creates an instance of VideoLinkService.
   * @param videoLinkRepository - Repository for managing video links in the database.
   * @param uploadCenterService - Service for handling video uploads.
   * @param titlesService - Service for managing titles.
   * @param episodeService - Service for managing episodes.
   */
  constructor(
    @InjectRepository(VideoLink)
    private readonly videoLinkRepository: Repository<VideoLink>,
    private readonly uploadCenterService: UploadCenterService,
    private readonly titlesService: TitlesService,
    private readonly episodeService: EpisodeService,
  ) {}

  /**
   * Creates a new video link.
   * @param dto - Data transfer object containing the details of the video link to be created.
   * @returns The created video link.
   */
  public async create(dto: CreateVideoLinkRequestDto) {
    let url: string | undefined = undefined;
    if (dto.url) {
      await this.uploadCenterService.confirmUpload(
        dto.url.key,
        UploadFromEntity.VIDEO,
        UploadType.VIDEO,
      );

      url = `${dto.url.bucket}/${dto.url.key}`;
    }
    const title = await this.titlesService.findById(dto.titleId);
    const episode = await this.episodeService.findById(dto.episodeId);
    const videoLink = this.videoLinkRepository.create({
      ...dto,
      title: dto.titleId ? { id: title.id } : null,
      episode: dto.episodeId ? { id: episode.id } : null,
      url,
    });
    return this.videoLinkRepository.save(videoLink);
  }

  /**
   * Creates multiple video links in a single transaction.
   * @param dto - Data transfer object containing an array of video link details to be created.
   * @returns An array of created video links.
   */
  public async createMulti(dto: CreateMultipleVideoLinkRequestDto) {
    if (!dto.data || dto.data.length === 0) {
      return [];
    }

    return this.videoLinkRepository.manager.transaction(async (manager) => {
      const videoLinks: VideoLink[] = [];

      for (const videoLinkDto of dto.data) {
        let url: string | undefined = undefined;
        if (videoLinkDto.url) {
          await this.uploadCenterService.confirmUpload(
            videoLinkDto.url.key,
            UploadFromEntity.VIDEO,
            UploadType.VIDEO,
          );
          url = `${videoLinkDto.url.bucket}/${videoLinkDto.url.key}`;
        }
        const title = await this.titlesService.findById(videoLinkDto.titleId);
        const episode = await this.episodeService.findById(
          videoLinkDto.episodeId,
        );
        const videoLink = manager.create(VideoLink, {
          ...videoLinkDto,
          title: videoLinkDto.titleId ? { id: title.id } : null,
          episode: videoLinkDto.episodeId ? { id: episode.id } : null,
          url,
        });
        videoLinks.push(videoLink);
      }

      return manager.save(videoLinks);
    });
  }

  /**
   * Updates an existing video link.
   * @param dto - Data transfer object containing the updated details of the video link.
   * @param id - The ID of the video link to be updated.
   * @returns The updated video link.
   */
  public async update(dto: UpdateVideoLinkRequestDto, id: number) {
    const existingVideoLink = await this.getById(id);

    let titleId: number | undefined = existingVideoLink?.title?.id;
    let episodeId: number | undefined = existingVideoLink?.episode?.id;

    let url = existingVideoLink.url;
    if (dto.url) {
      await this.uploadCenterService.confirmUpload(
        dto.url.key,
        UploadFromEntity.VIDEO,
        UploadType.VIDEO,
      );

      url = `${dto.url.bucket}/${dto.url.key}`;
    }
    if (dto.titleId) {
      if (episodeId) {
        throw new ConflictException(CONFLICT_EPISODE_EXIST_ERROR);
      }
      titleId = (await this.titlesService.findById(dto.titleId))?.id;
    }
    if (dto.episodeId) {
      if (titleId) {
        throw new ConflictException(CONFLICT_TITLE_EXIST_ERROR);
      }
      episodeId = (await this.episodeService.findById(dto.episodeId))?.id;
    }
    Object.assign(existingVideoLink, {
      ...dto,
      title: { id: titleId },
      episode: { id: episodeId },
      url,
    });
    return this.videoLinkRepository.save(existingVideoLink);
  }

  /**
   * Retrieves a video link by its ID.
   * @param id - The ID of the video link to be retrieved.
   * @returns The video link with the specified ID.
   * @throws NotFoundException if the video link is not found.
   */
  public async getById(id: number): Promise<VideoLink> {
    const video = await this.videoLinkRepository.findOneBy({ id });
    if (!video) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
    return video;
  }

  /**
   * Retrieves video links associated with a specific episode ID.
   * @param id - The ID of the episode for which to retrieve video links.
   * @returns An array of video links associated with the specified episode.
   * @throws NotFoundException if no video links are found for the given episode ID.
   */
  public async getByEpisodeId(id: number) {
    const video = await this.videoLinkRepository.findBy({ episode: { id } });
    if (!video || video.length === 0) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
    return video;
  }

  /**
   * Retrieves video links associated with a specific title ID.
   * @param id - The ID of the title for which to retrieve video links.
   * @returns An array of video links associated with the specified title.
   * @throws NotFoundException if no video links are found for the given title ID.
   */
  public async getByTitleId(id: number) {
    const video = await this.videoLinkRepository.findBy({ title: { id } });
    if (!video || video.length === 0) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
    return video;
  }

  /**
   * Deletes a video link by its ID.
   * @param id - The ID of the video link to be deleted.
   * @throws NotFoundException if the video link with the specified ID does not exist.
   */
  public async delete(id: number) {
    const { affected } = await this.videoLinkRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
  }
}
