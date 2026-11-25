import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'row_evidence.g.dart';

/// Row Evidence
@JsonSerializable(includeIfNull: false)
class SourceRowEvidence {
  const SourceRowEvidence({this.limit, this.offset, required this.subjectId, required this.subjectTable});
  final int? limit;
  final int? offset;
  final String subjectId;
  final SharedSubjectTable subjectTable;

  factory SourceRowEvidence.fromJson(Map<String, dynamic> json) => _$SourceRowEvidenceFromJson(json);

  Map<String, dynamic> toJson() => _$SourceRowEvidenceToJson(this);
}
