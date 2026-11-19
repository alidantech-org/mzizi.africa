import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'disputes.g.dart';

/// A recorded disagreement between sources about one record. Both claims are kept with their citations and shown side by side; nothing is overwritten.
@JsonSerializable(includeIfNull: false)
class SourceDisputes {
  const SourceDisputes({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kindId,
    this.resolutionCitationId,
    this.resolvedOn,
    required this.statusId,
    required this.subjectId,
    required this.subjectTable,
    required this.summary,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String kindId;
  final String? resolutionCitationId;
  final DateTime? resolvedOn;
  final String statusId;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final String summary;
  final DateTime updatedAt;
  final int version;

  factory SourceDisputes.fromJson(Map<String, dynamic> json) => _$SourceDisputesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDisputesToJson(this);
}
