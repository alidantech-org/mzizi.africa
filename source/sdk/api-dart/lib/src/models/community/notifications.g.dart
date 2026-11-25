// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notifications.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityNotifications _$CommunityNotificationsFromJson(Map<String, dynamic> json) => CommunityNotifications(
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String?,
  keyId: json['keyId'] as String,
  kindTerm: json['kindTerm'] as String,
  occurrenceId: json['occurrenceId'] as String?,
  postCountryId: json['postCountryId'] as String?,
  postId: json['postId'] as String?,
);

Map<String, dynamic> _$CommunityNotificationsToJson(CommunityNotifications instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
  'identityId': ?instance.identityId,
  'keyId': instance.keyId,
  'kindTerm': instance.kindTerm,
  'occurrenceId': ?instance.occurrenceId,
  'postCountryId': ?instance.postCountryId,
  'postId': ?instance.postId,
};
