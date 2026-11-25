import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legislature/vote_choice.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/legislature/motions.dart';
import 'package:mzizi_api/src/models/politics/parties.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';

part 'votes.g.dart';

/// How one member voted on one motion.
@JsonSerializable(includeIfNull: false)
class LegislatureVotes {
  const LegislatureVotes({
    required this.choice,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.holderId,
    required this.id,
    required this.motionId,
    this.partyId,
    required this.updatedAt,
    required this.version,
  });
  final LegislatureVoteChoice choice;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String holderId;
  final String id;
  final String motionId;
  final String? partyId;
  final DateTime updatedAt;
  final int version;

  factory LegislatureVotes.fromJson(Map<String, dynamic> json) => _$LegislatureVotesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureVotesToJson(this);
}
