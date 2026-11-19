// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coverage_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerCoverageList _$LedgerCoverageListFromJson(Map<String, dynamic> json) => LedgerCoverageList(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  items: (json['items'] as List<dynamic>).map((e) => LedgerCoverageItem.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LedgerCoverageListToJson(LedgerCoverageList instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'items': instance.items,
};
