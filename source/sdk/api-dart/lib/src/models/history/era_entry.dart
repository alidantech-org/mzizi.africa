import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/history/era_entry_names.dart';

part 'era_entry.g.dart';

/// Era Entry
@JsonSerializable(includeIfNull: false)
class HistoryEraEntry {
  const HistoryEraEntry({
    required this.code,
    required this.eraId,
    this.fromYear,
    required this.kindTerm,
    required this.names,
    this.parentId,
    this.toYear,
  });
  final String code;
  final String eraId;
  final int? fromYear;
  final String kindTerm;
  final List<HistoryEraEntryNames> names;
  final String? parentId;
  final int? toYear;

  factory HistoryEraEntry.fromJson(Map<String, dynamic> json) => _$HistoryEraEntryFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryEraEntryToJson(this);
}
