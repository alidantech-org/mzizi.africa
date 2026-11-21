// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_group.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerPlaceGroup _$ExplorerPlaceGroupFromJson(Map<String, dynamic> json) => ExplorerPlaceGroup(
  children: (json['children'] as List<dynamic>).map((e) => ExplorerPlace.fromJson(e as Map<String, dynamic>)).toList(),
  place: ExplorerPlace.fromJson(json['place'] as Map<String, dynamic>),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$ExplorerPlaceGroupToJson(ExplorerPlaceGroup instance) => <String, dynamic>{
  'children': instance.children,
  'place': instance.place,
  'total': instance.total,
};
