import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/legislature/sittings.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'attachments.g.dart';

/// Media on proceedings that are not identities (the parliamentary video of a speech).
@JsonSerializable(includeIfNull: false)
class LegislatureAttachments {
  const LegislatureAttachments({
    this.articleId,
    this.assetId,
    this.billId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endSecond,
    required this.id,
    this.position,
    required this.purposeTerm,
    this.sittingId,
    this.speechId,
    this.startSecond,
    required this.updatedAt,
    required this.version,
  });
  final String? articleId;
  final String? assetId;
  final String? billId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final double? endSecond;
  final String id;
  final int? position;
  final String purposeTerm;
  final String? sittingId;
  final String? speechId;
  final double? startSecond;
  final DateTime updatedAt;
  final int version;

  factory LegislatureAttachments.fromJson(Map<String, dynamic> json) => _$LegislatureAttachmentsFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureAttachmentsToJson(this);
}
