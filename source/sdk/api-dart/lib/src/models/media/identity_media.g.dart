// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identity_media.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaIdentityMedia _$MediaIdentityMediaFromJson(Map<String, dynamic> json) => MediaIdentityMedia(
  identityId: json['identityId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$MediaIdentityMediaToJson(MediaIdentityMedia instance) => <String, dynamic>{
  'identityId': instance.identityId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
