import 'package:json_annotation/json_annotation.dart';

part 'fact_row.g.dart';

/// Fact Row
@JsonSerializable(includeIfNull: false)
class ExperienceFactRow {
  const ExperienceFactRow({required this.code, this.detail, this.place, required this.statement, required this.tagged});
  final String code;
  final String? detail;
  final String? place;
  final String statement;
  final bool tagged;

  factory ExperienceFactRow.fromJson(Map<String, dynamic> json) => _$ExperienceFactRowFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFactRowToJson(this);
}
