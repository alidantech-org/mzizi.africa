import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/product/release_status.dart';
import 'package:mzizi_api/src/models/product/apps.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'releases.g.dart';

/// Which country is served on which app and since when.
@JsonSerializable(includeIfNull: false)
class ProductReleases {
  const ProductReleases({
    required this.appId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromOn,
    required this.id,
    required this.status,
    this.toOn,
    required this.updatedAt,
    required this.version,
  });
  final String appId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? fromOn;
  final String id;
  final ProductReleaseStatus status;
  final DateTime? toOn;
  final DateTime updatedAt;
  final int version;

  factory ProductReleases.fromJson(Map<String, dynamic> json) => _$ProductReleasesFromJson(json);

  Map<String, dynamic> toJson() => _$ProductReleasesToJson(this);
}
