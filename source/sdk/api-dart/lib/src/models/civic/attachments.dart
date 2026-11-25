import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/deliveries.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'attachments.g.dart';

/// Media on projects, contracts and deliveries (site photos, signed contracts).
@JsonSerializable(includeIfNull: false)
class CivicAttachments {
  const CivicAttachments({
    this.articleId,
    this.assetId,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    this.deliveryId,
    this.endSecond,
    required this.id,
    this.position,
    this.projectId,
    required this.purposeTerm,
    this.startSecond,
    required this.updatedAt,
    required this.version,
  });
  final String? articleId;
  final String? assetId;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? deliveryId;
  final double? endSecond;
  final String id;
  final int? position;
  final String? projectId;
  final String purposeTerm;
  final double? startSecond;
  final DateTime updatedAt;
  final int version;

  factory CivicAttachments.fromJson(Map<String, dynamic> json) => _$CivicAttachmentsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicAttachmentsToJson(this);
}
