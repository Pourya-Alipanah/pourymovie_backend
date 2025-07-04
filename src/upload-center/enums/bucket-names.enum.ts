/**
 * Enum representing the names of various buckets used in the upload center.
 * This enum is used to define the different types of uploads and their corresponding bucket names.
 */
export enum BufferBucketNames {
  AVATAR = 'avatar',
  PROFILE = 'profile',
  COVER = 'cover',
  THUMBNAIL = 'thumbnail',
}

/**
 * Enum representing the names of stream-related buckets.
 * This enum is used to define the buckets specifically for video and trailer streams.
 */
export enum StreamBucketNames {
  TRAILER = 'trailer',
  VIDEO = 'video',
}

/**
 * Enum representing the names of public buckets used in the upload center.
 * This enum is used to define the publicly accessible buckets for various types of uploads.
 */
export enum PublicBucketNames {
  TRAILER = 'trailer',
  PROFILE = 'profile',
  COVER = 'cover',
  THUMBNAIL = 'thumbnail',
}