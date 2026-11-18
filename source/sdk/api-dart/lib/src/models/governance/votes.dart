import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/motions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'votes.g.dart';

/// One office holder's recorded position on one motion (a division), including being absent.
@JsonSerializable(includeIfNull: false)
class GovernanceVotes {
  const GovernanceVotes({
    required this.createdAt,
    this.deletedAt,
    required this.holderId,
    required this.id,
    required this.motionId,
    required this.positionId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String holderId;
  final String id;
  final String motionId;
  final String positionId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceVotes.fromJson(Map<String, dynamic> json) => _$GovernanceVotesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceVotesToJson(this);
}
