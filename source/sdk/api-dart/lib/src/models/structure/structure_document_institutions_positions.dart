import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/structure/structure_document_institutions_positions_offices.dart';
import 'package:mzizi_api/src/models/structure/structure_document_institutions_positions_powers.dart';

part 'structure_document_institutions_positions.g.dart';

/// Structure Document Institutions Positions
@JsonSerializable(includeIfNull: false)
class StructureStructureDocumentInstitutionsPositions {
  const StructureStructureDocumentInstitutionsPositions({
    this.citationId,
    required this.code,
    this.fixedSeats,
    required this.id,
    required this.offices,
    required this.powers,
    required this.role,
    required this.seatBasisCode,
    required this.seatBasisLabel,
    required this.selectionCode,
    required this.selectionLabel,
    this.termLimit,
    this.termYears,
    required this.title,
    this.unitLevelId,
  });
  final String? citationId;
  final String code;
  final int? fixedSeats;
  final String id;
  final List<StructureStructureDocumentInstitutionsPositionsOffices> offices;
  final List<StructureStructureDocumentInstitutionsPositionsPowers> powers;
  final String role;
  final String seatBasisCode;
  final String seatBasisLabel;
  final String selectionCode;
  final String selectionLabel;
  final int? termLimit;
  final int? termYears;
  final String title;
  final String? unitLevelId;

  factory StructureStructureDocumentInstitutionsPositions.fromJson(Map<String, dynamic> json) =>
      _$StructureStructureDocumentInstitutionsPositionsFromJson(json);

  Map<String, dynamic> toJson() => _$StructureStructureDocumentInstitutionsPositionsToJson(this);
}
