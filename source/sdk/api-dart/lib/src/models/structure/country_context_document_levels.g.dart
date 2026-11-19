// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_context_document_levels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StructureCountryContextDocumentLevels _$StructureCountryContextDocumentLevelsFromJson(Map<String, dynamic> json) =>
    StructureCountryContextDocumentLevels(
      depth: (json['depth'] as num).toInt(),
      id: json['id'] as String,
      kind: json['kind'] as String,
      kindCode: json['kindCode'] as String,
      rootFeatureId: json['rootFeatureId'] as String?,
      routing: json['routing'] as bool,
    );

Map<String, dynamic> _$StructureCountryContextDocumentLevelsToJson(StructureCountryContextDocumentLevels instance) => <String, dynamic>{
  'depth': instance.depth,
  'id': instance.id,
  'kind': instance.kind,
  'kindCode': instance.kindCode,
  'rootFeatureId': ?instance.rootFeatureId,
  'routing': instance.routing,
};
