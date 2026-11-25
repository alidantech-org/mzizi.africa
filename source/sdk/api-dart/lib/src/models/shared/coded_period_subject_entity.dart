import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';

part 'coded_period_subject_entity.g.dart';

/// Base for versioned, coded records about one subject row, with a period of integer years.
@JsonSerializable(includeIfNull: false)
class SharedCodedPeriodSubjectEntity {
  const SharedCodedPeriodSubjectEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.subjectId,
    required this.subjectTable,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SharedCodedPeriodSubjectEntity.fromJson(Map<String, dynamic> json) => _$SharedCodedPeriodSubjectEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedPeriodSubjectEntityToJson(this);
}
