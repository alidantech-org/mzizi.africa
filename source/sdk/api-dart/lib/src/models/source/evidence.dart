import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/enums/source/evidence_method.dart';
import 'package:mzizi_api/src/enums/source/evidence_role.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'evidence.g.dart';

/// The provenance linking table: which citation supports, or contradicts, which row. No foreign key on the subject by design; soft-deleted rows keep their evidence.
@JsonSerializable(includeIfNull: false)
class SourceEvidence {
  const SourceEvidence({
    required this.citationId,
    this.confidence,
    required this.createdAt,
    this.fields,
    required this.id,
    required this.method,
    this.observedAt,
    required this.recordedAt,
    required this.role,
    required this.subjectId,
    required this.subjectTable,
  });
  final String citationId;
  final double? confidence;
  final DateTime createdAt;
  final List<String>? fields;
  final String id;
  final SourceEvidenceMethod method;
  final DateTime? observedAt;
  final DateTime recordedAt;
  final SourceEvidenceRole role;
  final String subjectId;
  final SharedSubjectTable subjectTable;

  factory SourceEvidence.fromJson(Map<String, dynamic> json) => _$SourceEvidenceFromJson(json);

  Map<String, dynamic> toJson() => _$SourceEvidenceToJson(this);
}
