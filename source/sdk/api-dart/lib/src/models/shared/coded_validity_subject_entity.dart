import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';

part 'coded_validity_subject_entity.g.dart';

/// Base for versioned, coded records about one subject row, valid over an optional period.
@JsonSerializable(includeIfNull: false)
class SharedCodedValiditySubjectEntity {
  const SharedCodedValiditySubjectEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.subjectId,
    required this.subjectTable,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory SharedCodedValiditySubjectEntity.fromJson(Map<String, dynamic> json) => _$SharedCodedValiditySubjectEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedValiditySubjectEntityToJson(this);
}
