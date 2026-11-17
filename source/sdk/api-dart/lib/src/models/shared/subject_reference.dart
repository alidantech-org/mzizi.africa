import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';

part 'subject_reference.g.dart';

/// Base for a record about one subject: the subject's fully qualified table and its row id. Contributes no other fields.
@JsonSerializable(includeIfNull: false)
class SharedSubjectReference {
  const SharedSubjectReference({required this.subjectId, required this.subjectTable});
  final String subjectId;
  final SharedSubjectTable subjectTable;

  factory SharedSubjectReference.fromJson(Map<String, dynamic> json) => _$SharedSubjectReferenceFromJson(json);

  Map<String, dynamic> toJson() => _$SharedSubjectReferenceToJson(this);
}
