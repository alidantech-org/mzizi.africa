// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'rank_row.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendRankRow _$FrontendRankRowFromJson(Map<String, dynamic> json) => FrontendRankRow(
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
  place: json['place'] as String,
  rank: (json['rank'] as num?)?.toInt(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  value: (json['value'] as num?)?.toDouble(),
);

Map<String, dynamic> _$FrontendRankRowToJson(FrontendRankRow instance) => <String, dynamic>{
  'name': instance.name,
  'place': instance.place,
  'rank': ?instance.rank,
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'value': ?instance.value,
};

const _$SharedFigureStatusEnumMap = {
  SharedFigureStatus.estimated: 'estimated',
  SharedFigureStatus.finalValue: 'final',
  SharedFigureStatus.missing: 'missing',
  SharedFigureStatus.projected: 'projected',
  SharedFigureStatus.provisional: 'provisional',
  SharedFigureStatus.revised: 'revised',
  SharedFigureStatus.suppressed: 'suppressed',
};
