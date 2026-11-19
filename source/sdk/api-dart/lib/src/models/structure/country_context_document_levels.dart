import 'package:json_annotation/json_annotation.dart';

part 'country_context_document_levels.g.dart';

/// Country Context Document Levels
@JsonSerializable(includeIfNull: false)
class StructureCountryContextDocumentLevels {
  const StructureCountryContextDocumentLevels({
    required this.depth,
    required this.id,
    required this.kind,
    required this.kindCode,
    this.rootFeatureId,
    required this.routing,
  });
  final int depth;
  final String id;
  final String kind;
  final String kindCode;
  final String? rootFeatureId;
  final bool routing;

  factory StructureCountryContextDocumentLevels.fromJson(Map<String, dynamic> json) => _$StructureCountryContextDocumentLevelsFromJson(json);

  Map<String, dynamic> toJson() => _$StructureCountryContextDocumentLevelsToJson(this);
}
