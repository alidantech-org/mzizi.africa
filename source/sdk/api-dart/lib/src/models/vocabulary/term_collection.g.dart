// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'term_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyTermCollection _$VocabularyTermCollectionFromJson(Map<String, dynamic> json) => VocabularyTermCollection(
  terms: (json['terms'] as List<dynamic>).map((e) => VocabularyTermEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$VocabularyTermCollectionToJson(VocabularyTermCollection instance) => <String, dynamic>{'terms': instance.terms};
