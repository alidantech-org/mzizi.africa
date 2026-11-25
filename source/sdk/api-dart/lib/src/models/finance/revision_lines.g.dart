// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'revision_lines.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceRevisionLines _$FinanceRevisionLinesFromJson(Map<String, dynamic> json) => FinanceRevisionLines(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  revisionId: json['revisionId'] as String,
);

Map<String, dynamic> _$FinanceRevisionLinesToJson(FinanceRevisionLines instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'revisionId': instance.revisionId,
};
