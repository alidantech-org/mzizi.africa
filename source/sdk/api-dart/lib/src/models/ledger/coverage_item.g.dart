// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coverage_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerCoverageItem _$LedgerCoverageItemFromJson(Map<String, dynamic> json) => LedgerCoverageItem(
  checkedOn: json['checkedOn'] as String?,
  code: json['code'] as String,
  expectedAt: json['expectedAt'] as String?,
  level: json['level'] as String?,
  note: json['note'] as String?,
  source: json['source'] as String?,
  subject: json['subject'] as String,
);

Map<String, dynamic> _$LedgerCoverageItemToJson(LedgerCoverageItem instance) => <String, dynamic>{
  'checkedOn': ?instance.checkedOn,
  'code': instance.code,
  'expectedAt': ?instance.expectedAt,
  'level': ?instance.level,
  'note': ?instance.note,
  'source': ?instance.source,
  'subject': instance.subject,
};
