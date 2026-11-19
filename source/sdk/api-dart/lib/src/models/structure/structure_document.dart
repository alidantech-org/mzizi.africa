import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/structure/structure_document_functions.dart';
import 'package:mzizi_api/src/models/structure/structure_document_institutions.dart';
import 'package:mzizi_api/src/models/structure/structure_document_procedures.dart';

part 'structure_document.g.dart';

/// Structure Document
@JsonSerializable(includeIfNull: false)
class StructureStructureDocument {
  const StructureStructureDocument({
    this.countryCode,
    required this.countryId,
    required this.countryName,
    required this.functions,
    required this.institutions,
    required this.procedures,
  });
  final String? countryCode;
  final String countryId;
  final String countryName;
  final List<StructureStructureDocumentFunctions> functions;
  final List<StructureStructureDocumentInstitutions> institutions;
  final List<StructureStructureDocumentProcedures> procedures;

  factory StructureStructureDocument.fromJson(Map<String, dynamic> json) => _$StructureStructureDocumentFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentToJson(this);
}
