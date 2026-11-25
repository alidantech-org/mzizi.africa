// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bill_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureBillCollection _$LegislatureBillCollectionFromJson(Map<String, dynamic> json) => LegislatureBillCollection(
  bills: (json['bills'] as List<dynamic>).map((e) => LegislatureBillEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LegislatureBillCollectionToJson(LegislatureBillCollection instance) => <String, dynamic>{'bills': instance.bills};
