// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'law_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLawList _$InsightsLawListFromJson(Map<String, dynamic> json) => InsightsLawList(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  instruments: (json['instruments'] as List<dynamic>).map((e) => InsightsLawInstrument.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsLawListToJson(InsightsLawList instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'instruments': instance.instruments,
};
