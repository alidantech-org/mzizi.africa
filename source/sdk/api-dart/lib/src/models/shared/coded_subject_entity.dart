import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'coded_subject_entity.g.dart';

/// Base for versioned, coded records about one subject row.
@JsonSerializable(includeIfNull: false)
class SharedCodedSubjectEntity {
  const SharedCodedSubjectEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.subjectId,
    required this.subjectTable,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final DateTime updatedAt;
  final int version;

  factory SharedCodedSubjectEntity.fromJson(Map<String, dynamic> json) => _$SharedCodedSubjectEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedSubjectEntityToJson(this);
}
