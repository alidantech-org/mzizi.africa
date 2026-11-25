// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'finding_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFindingCollection _$FinanceFindingCollectionFromJson(Map<String, dynamic> json) => FinanceFindingCollection(
  findings: (json['findings'] as List<dynamic>).map((e) => FinanceFindingEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FinanceFindingCollectionToJson(FinanceFindingCollection instance) => <String, dynamic>{'findings': instance.findings};
