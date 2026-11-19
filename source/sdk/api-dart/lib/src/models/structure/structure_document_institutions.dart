import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/structure/structure_document_institutions_names.dart';
import 'package:mzizi_api/src/models/structure/structure_document_institutions_positions.dart';
import 'package:mzizi_api/src/models/structure/structure_document_institutions_powers.dart';

part 'structure_document_institutions.g.dart';

/// Structure Document Institutions
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentInstitutions {
  const StructureStructureDocumentInstitutions({
    this.arm,
    this.citationId,
    required this.code,
    required this.id,
    required this.kind,
    required this.names,
    required this.positions,
    required this.powers,
  });
  final String? arm;
  final String? citationId;
  final String code;
  final String id;
  final String kind;
  final List<StructureStructureDocumentInstitutionsNames> names;
  final List<StructureStructureDocumentInstitutionsPositions> positions;
  final List<StructureStructureDocumentInstitutionsPowers> powers;

  factory StructureStructureDocumentInstitutions.fromJson(Map<String, dynamic> json) => _$StructureStructureDocumentInstitutionsFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentInstitutionsToJson(this);
}
