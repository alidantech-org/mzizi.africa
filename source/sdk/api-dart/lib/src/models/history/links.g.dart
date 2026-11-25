// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'links.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryLinks _$HistoryLinksFromJson(Map<String, dynamic> json) => HistoryLinks(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromId: json['fromId'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$HistoryLinkKindEnumMap, json['kind']),
  toId: json['toId'] as String,
);

Map<String, dynamic> _$HistoryLinksToJson(HistoryLinks instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromId': instance.fromId,
  'id': instance.id,
  'kind': _$HistoryLinkKindEnumMap[instance.kind]!,
  'toId': instance.toId,
};

const _$HistoryLinkKindEnumMap = {
  HistoryLinkKind.caused: 'caused',
  HistoryLinkKind.followed: 'followed',
  HistoryLinkKind.ledTo: 'led-to',
  HistoryLinkKind.partOf: 'part-of',
  HistoryLinkKind.replaced: 'replaced',
};
