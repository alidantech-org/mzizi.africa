import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/structure/country_context_document_levels.dart';

part 'country_context_document.g.dart';

/// Country Context Document
@JsonSerializable(includeIfNull: false)
class StructureCountryContextDocument {
  const StructureCountryContextDocument({this.code, required this.countryId, required this.levels, required this.name});
  final String? code;
  final String countryId;
  final List<StructureCountryContextDocumentLevels> levels;
  final String name;

  factory StructureCountryContextDocument.fromJson(Map<String, dynamic> json) => _$StructureCountryContextDocumentFromJson(json);

  Map<String, dynamic> toJson() => _$StructureCountryContextDocumentToJson(this);
}
