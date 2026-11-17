// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'value_label.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceValueLabel _$ReferenceValueLabelFromJson(Map<String, dynamic> json) => ReferenceValueLabel(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  label: json['label'] as String,
  labelKind: $enumDecode(_$ReferenceValueLabelKindEnumMap, json['labelKind']),
  languageId: json['languageId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  valueId: json['valueId'] as String,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceValueLabelToJson(ReferenceValueLabel instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'label': instance.label,
  'labelKind': _$ReferenceValueLabelKindEnumMap[instance.labelKind]!,
  'languageId': instance.languageId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'valueId': instance.valueId,
  'version': instance.version,
};

const _$ReferenceValueLabelKindEnumMap = {
  ReferenceValueLabelKind.abbreviation: 'abbreviation',
  ReferenceValueLabelKind.alternative: 'alternative',
  ReferenceValueLabelKind.definition: 'definition',
  ReferenceValueLabelKind.preferred: 'preferred',
};
