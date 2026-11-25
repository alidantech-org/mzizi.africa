import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/politics/commitments.dart';
import 'package:mzizi_api/src/models/politics/fulfilments.dart';
import 'package:mzizi_api/src/models/politics/manifestos.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'attachments.g.dart';

/// Media on commitments, fulfilments and manifestos (the video of a promise).
@JsonSerializable(includeIfNull: false)
class PoliticsAttachments {
  const PoliticsAttachments({
    this.articleId,
    this.assetId,
    this.commitmentId,
    required this.createdAt,
    this.deletedAt,
    this.endSecond,
    this.fulfilmentId,
    required this.id,
    this.manifestoId,
    this.position,
    required this.purposeTerm,
    this.startSecond,
    required this.updatedAt,
    required this.version,
  });
  final String? articleId;
  final String? assetId;
  final String? commitmentId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final double? endSecond;
  final String? fulfilmentId;
  final String id;
  final String? manifestoId;
  final int? position;
  final String purposeTerm;
  final double? startSecond;
  final DateTime updatedAt;
  final int version;

  factory PoliticsAttachments.fromJson(Map<String, dynamic> json) => _$PoliticsAttachmentsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsAttachmentsToJson(this);
}
