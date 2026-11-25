import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/product/site_status.dart';
import 'package:mzizi_api/src/models/product/apps.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/locales.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'sites.g.dart';

/// A public site or domain of an app, with its default locale and status.
@JsonSerializable(includeIfNull: false)
class ProductSites {
  const ProductSites({
    required this.appId,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.host,
    required this.id,
    this.localeId,
    required this.status,
    required this.updatedAt,
    required this.version,
  });
  final String appId;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String host;
  final String id;
  final String? localeId;
  final ProductSiteStatus status;
  final DateTime updatedAt;
  final int version;

  factory ProductSites.fromJson(Map<String, dynamic> json) => _$ProductSitesFromJson(json);

  Map<String, dynamic> toJson() => _$ProductSitesToJson(this);
}
