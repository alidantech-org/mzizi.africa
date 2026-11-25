import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/candidates.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/election/elections.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'attachments.g.dart';

/// Media on elections, contests and candidates (a debate video).
@JsonSerializable(includeIfNull: false)
class ElectionAttachments {
  const ElectionAttachments({
    this.articleId,
    this.assetId,
    this.candidateId,
    this.contestId,
    required this.createdAt,
    this.deletedAt,
    this.electionId,
    this.endSecond,
    required this.id,
    this.position,
    required this.purposeTerm,
    this.startSecond,
    required this.updatedAt,
    required this.version,
  });
  final String? articleId;
  final String? assetId;
  final String? candidateId;
  final String? contestId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? electionId;
  final double? endSecond;
  final String id;
  final int? position;
  final String purposeTerm;
  final double? startSecond;
  final DateTime updatedAt;
  final int version;

  factory ElectionAttachments.fromJson(Map<String, dynamic> json) => _$ElectionAttachmentsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionAttachmentsToJson(this);
}
