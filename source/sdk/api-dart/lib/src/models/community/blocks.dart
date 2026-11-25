import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/community/cases.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'blocks.g.dart';

/// A block on an account that posted bad content; a blocked account cannot sign in or contribute.
@JsonSerializable(includeIfNull: false)
class CommunityBlocks {
  const CommunityBlocks({
    required this.accountId,
    this.caseId,
    required this.createdAt,
    required this.decidedBy,
    this.deletedAt,
    required this.fromOn,
    required this.id,
    required this.reasonTerm,
    this.toOn,
    required this.updatedAt,
    required this.version,
  });
  final String accountId;
  final String? caseId;
  final DateTime createdAt;
  final String decidedBy;
  final DateTime? deletedAt;
  final DateTime fromOn;
  final String id;
  final String reasonTerm;
  final DateTime? toOn;
  final DateTime updatedAt;
  final int version;

  factory CommunityBlocks.fromJson(Map<String, dynamic> json) => _$CommunityBlocksFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityBlocksToJson(this);
}
