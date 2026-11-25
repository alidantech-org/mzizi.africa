// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'appropriation_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceAppropriationCollection _$FinanceAppropriationCollectionFromJson(Map<String, dynamic> json) => FinanceAppropriationCollection(
  appropriations: (json['appropriations'] as List<dynamic>).map((e) => FinanceAppropriationEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FinanceAppropriationCollectionToJson(FinanceAppropriationCollection instance) => <String, dynamic>{
  'appropriations': instance.appropriations,
};
