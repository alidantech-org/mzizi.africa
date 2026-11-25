// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'term_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyTermWindow _$VocabularyTermWindowFromJson(Map<String, dynamic> json) => VocabularyTermWindow(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  schemeId: json['schemeId'] as String,
);

Map<String, dynamic> _$VocabularyTermWindowToJson(VocabularyTermWindow instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'schemeId': instance.schemeId,
};
