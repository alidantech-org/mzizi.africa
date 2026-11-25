import 'package:json_annotation/json_annotation.dart';

part 'election_detail_contests_candidates_names.g.dart';

/// Election Detail Contests Candidates Names
@JsonSerializable(includeIfNull: false)
class ElectionElectionDetailContestsCandidatesNames {
  const ElectionElectionDetailContestsCandidatesNames({
    this.fromYear,
    required this.isDefault,
    required this.kindTerm,
    required this.languageCode,
    this.languageIso,
    required this.text,
    this.toYear,
  });
  final int? fromYear;
  final bool isDefault;
  final String kindTerm;
  final String languageCode;
  final String? languageIso;
  final String text;
  final int? toYear;

  factory ElectionElectionDetailContestsCandidatesNames.fromJson(Map<String, dynamic> json) =>
      _$ElectionElectionDetailContestsCandidatesNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionDetailContestsCandidatesNamesToJson(this);
}
