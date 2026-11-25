import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/history/history_entry_names.dart';

part 'history_entry.g.dart';

/// History Entry
@JsonSerializable(includeIfNull: false)
class HistoryHistoryEntry {
  const HistoryHistoryEntry({
    required this.code,
    this.fromYear,
    required this.kindTerm,
    required this.names,
    required this.occurrenceId,
    required this.precision,
    this.startsOn,
    this.toYear,
  });
  final String code;
  final int? fromYear;
  final String kindTerm;
  final List<HistoryHistoryEntryNames> names;
  final String occurrenceId;
  final SharedDatePrecision precision;
  final DateTime? startsOn;
  final int? toYear;

  factory HistoryHistoryEntry.fromJson(Map<String, dynamic> json) => _$HistoryHistoryEntryFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryHistoryEntryToJson(this);
}
