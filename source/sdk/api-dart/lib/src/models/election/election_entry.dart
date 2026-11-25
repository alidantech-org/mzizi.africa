import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/election_entry_names.dart';

part 'election_entry.g.dart';

/// Election Entry
@JsonSerializable(includeIfNull: false)
class ElectionElectionEntry {
  const ElectionElectionEntry({
    required this.code,
    required this.electionId,
    this.eventId,
    required this.fromYear,
    this.heldOn,
    required this.kindTerm,
    required this.names,
    required this.statusTerm,
  });
  final String code;
  final String electionId;
  final String? eventId;
  final int fromYear;
  final DateTime? heldOn;
  final String kindTerm;
  final List<ElectionElectionEntryNames> names;
  final String statusTerm;

  factory ElectionElectionEntry.fromJson(Map<String, dynamic> json) => _$ElectionElectionEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionEntryToJson(this);
}
