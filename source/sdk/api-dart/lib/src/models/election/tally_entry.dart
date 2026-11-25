import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';

part 'tally_entry.g.dart';

/// Tally Entry
@JsonSerializable(includeIfNull: false)
class ElectionTallyEntry {
  const ElectionTallyEntry({
    required this.basis,
    this.candidateId,
    this.choiceId,
    required this.contestId,
    required this.refreshedAt,
    this.share,
    required this.status,
    this.votes,
  });
  final SharedFigureBasis basis;
  final String? candidateId;
  final String? choiceId;
  final String contestId;
  final DateTime refreshedAt;
  final double? share;
  final SharedFigureStatus status;
  final int? votes;

  factory ElectionTallyEntry.fromJson(Map<String, dynamic> json) => _$ElectionTallyEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionTallyEntryToJson(this);
}
