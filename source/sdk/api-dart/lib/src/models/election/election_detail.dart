import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/election_detail_contests.dart';
import 'package:mzizi_api/src/models/election/election_detail_names.dart';

part 'election_detail.g.dart';

/// Election Detail
@JsonSerializable(includeIfNull: false)
class ElectionElectionDetail {
  const ElectionElectionDetail({
    required this.code,
    required this.contests,
    required this.electionId,
    required this.fromYear,
    this.heldOn,
    required this.kindTerm,
    required this.names,
    required this.statusTerm,
  });
  final String code;
  final List<ElectionElectionDetailContests> contests;
  final String electionId;
  final int fromYear;
  final DateTime? heldOn;
  final String kindTerm;
  final List<ElectionElectionDetailNames> names;
  final String statusTerm;

  factory ElectionElectionDetail.fromJson(Map<String, dynamic> json) => _$ElectionElectionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionDetailToJson(this);
}
