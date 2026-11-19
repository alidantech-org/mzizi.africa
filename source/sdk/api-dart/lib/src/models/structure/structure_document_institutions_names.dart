import 'package:json_annotation/json_annotation.dart';

part 'structure_document_institutions_names.g.dart';

/// Structure Document Institutions Names
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentInstitutionsNames {
  const StructureStructureDocumentInstitutionsNames({required this.name, required this.preferred});
  final String name;
  final bool preferred;

  factory StructureStructureDocumentInstitutionsNames.fromJson(Map<String, dynamic> json) =>
      _$StructureStructureDocumentInstitutionsNamesFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentInstitutionsNamesToJson(this);
}
