import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/checker.dart';
import 'package:mzizi_api/src/enums/community/verdict.dart';
import 'package:mzizi_api/src/models/community/cases.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'checks.g.dart';

/// One automated or human check of a moderation case.
@JsonSerializable(includeIfNull: false)
class CommunityChecks {
  const CommunityChecks({
    required this.caseId,
    this.categoryTerm,
    required this.checkedAt,
    required this.checker,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.score,
    required this.updatedAt,
    required this.verdict,
    required this.version,
  });
  final String caseId;
  final String? categoryTerm;
  final DateTime checkedAt;
  final CommunityChecker checker;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final double? score;
  final DateTime updatedAt;
  final CommunityVerdict verdict;
  final int version;

  factory CommunityChecks.fromJson(Map<String, dynamic> json) => _$CommunityChecksFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityChecksToJson(this);
}
