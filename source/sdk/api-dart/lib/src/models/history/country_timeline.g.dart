// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_timeline.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryCountryTimeline _$HistoryCountryTimelineFromJson(Map<String, dynamic> json) => HistoryCountryTimeline(
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$HistoryCountryTimelineToJson(HistoryCountryTimeline instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
