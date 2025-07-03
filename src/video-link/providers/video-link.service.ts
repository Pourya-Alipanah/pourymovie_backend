import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoLink } from '../video-link.entity';
import { Repository } from 'typeorm';
import { CreateVideoLinkRequestDto } from '../dtos/request/create-video-link.dto';
import { UploadFromEntity } from 'src/upload-center/enums/upload-from-entity.enum';
import { UploadType } from 'src/upload-center/enums/upload-type.enum';
import { UploadCenterService } from 'src/upload-center/providers/upload-center.service';
import { VIDEO_LINK_NOT_FOUND_ERROR } from '../constants/video-link.errors.constant';
import { UpdateVideoLinkRequestDto } from '../dtos/request/update-video-link.dto';

@Injectable()
export class VideoLinkService {
  constructor(
    @InjectRepository(VideoLink)
    private readonly videoLinkRepository: Repository<VideoLink>,
    private readonly uploadCenterService: UploadCenterService,
  ) {}

  public async create(dto: CreateVideoLinkRequestDto) {
    let url: string | undefined = undefined;
    if (dto.url) {
      const finalUrl = await this.uploadCenterService.confirmUpload(
        dto.url.key,
        UploadFromEntity.VIDEO,
        UploadType.VIDEO,
      );

      url = finalUrl;
    }
    const videoLink = this.videoLinkRepository.create({ ...dto, url });
    return this.videoLinkRepository.save(videoLink);
  }

  public async update(dto: UpdateVideoLinkRequestDto, id: number) {
    const existingVideoLink = await this.getById(id);
    let url = existingVideoLink.url;
    if (dto.url) {
      const finalUrl = await this.uploadCenterService.confirmUpload(
        dto.url.key,
        UploadFromEntity.VIDEO,
        UploadType.VIDEO,
      );

      url = finalUrl;
    }
    Object.assign(existingVideoLink, { ...dto, url });
    return this.videoLinkRepository.save(existingVideoLink);
  }

  public async getById(id: number) {
    const video = await this.videoLinkRepository.findOneBy({ id });
    if (!video) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
    return video;
  }

  public async getByEpisodeId(id: number) {
    const video = await this.videoLinkRepository.findOneBy({ episode: { id } });
    if (!video) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
    return video;
  }

  public async getByTitleId(id: number) {
    const video = await this.videoLinkRepository.findOneBy({ title: { id } });
    if (!video) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
    return video;
  }

  public async delete(id: number) {
    const { affected } = await this.videoLinkRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException(VIDEO_LINK_NOT_FOUND_ERROR);
    }
  }
}
