import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legislature/vote_choice.dart';

part 'vote_entry.g.dart';

/// Vote Entry
@JsonSerializable(includeIfNull: false)
class LegislatureVoteEntry {
  const LegislatureVoteEntry({required this.choice, required this.holderId, required this.individualId, this.partyCode, this.partyId});
  final LegislatureVoteChoice choice;
  final String holderId;
  final String individualId;
  final String? partyCode;
  final String? partyId;

  factory LegislatureVoteEntry.fromJson(Map<String, dynamic> json) => _$LegislatureVoteEntryFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureVoteEntryToJson(this);
}
