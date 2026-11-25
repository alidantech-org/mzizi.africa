// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_votes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureMotionVotes _$LegislatureMotionVotesFromJson(Map<String, dynamic> json) => LegislatureMotionVotes(
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  motionId: json['motionId'] as String,
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$LegislatureMotionVotesToJson(LegislatureMotionVotes instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'motionId': instance.motionId,
  'offset': ?instance.offset,
};
