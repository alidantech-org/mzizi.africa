// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_browse.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceBrowse _$InsightsPlaceBrowseFromJson(Map<String, dynamic> json) => InsightsPlaceBrowse(
  chain: (json['chain'] as List<dynamic>).map((e) => InsightsPlaceCrumb.fromJson(e as Map<String, dynamic>)).toList(),
  children: (json['children'] as List<dynamic>).map((e) => InsightsPlaceChild.fromJson(e as Map<String, dynamic>)).toList(),
  media: json['media'] as List<dynamic>,
  place: json['place'] == null ? null : InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsPlaceBrowseToJson(InsightsPlaceBrowse instance) => <String, dynamic>{
  'chain': instance.chain,
  'children': instance.children,
  'media': instance.media,
  'place': ?instance.place,
};
