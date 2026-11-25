// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provision_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalProvisionEntry _$LegalProvisionEntryFromJson(Map<String, dynamic> json) => LegalProvisionEntry(
  code: json['code'] as String,
  designation: json['designation'] as String,
  kind: $enumDecode(_$LegalProvisionKindEnumMap, json['kind']),
  parentId: json['parentId'] as String?,
  position: (json['position'] as num).toInt(),
  provisionId: json['provisionId'] as String,
  wordings: (json['wordings'] as List<dynamic>).map((e) => LegalProvisionEntryWordings.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LegalProvisionEntryToJson(LegalProvisionEntry instance) => <String, dynamic>{
  'code': instance.code,
  'designation': instance.designation,
  'kind': _$LegalProvisionKindEnumMap[instance.kind]!,
  'parentId': ?instance.parentId,
  'position': instance.position,
  'provisionId': instance.provisionId,
  'wordings': instance.wordings,
};

const _$LegalProvisionKindEnumMap = {
  LegalProvisionKind.article: 'article',
  LegalProvisionKind.chapter: 'chapter',
  LegalProvisionKind.clause: 'clause',
  LegalProvisionKind.definition: 'definition',
  LegalProvisionKind.item: 'item',
  LegalProvisionKind.paragraph: 'paragraph',
  LegalProvisionKind.partValue: 'part',
  LegalProvisionKind.preamble: 'preamble',
  LegalProvisionKind.schedule: 'schedule',
  LegalProvisionKind.subparagraph: 'subparagraph',
};
