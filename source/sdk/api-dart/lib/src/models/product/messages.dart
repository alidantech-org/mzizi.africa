import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/product/message_status.dart';
import 'package:mzizi_api/src/enums/product/text_origin.dart';
import 'package:mzizi_api/src/models/product/keys.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'messages.g.dart';

/// The text of one interface key in one language, optionally for one country.
@JsonSerializable(includeIfNull: false)
class ProductMessages {
  const ProductMessages({
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.keyId,
    required this.languageId,
    required this.origin,
    required this.status,
    required this.text,
    this.translator,
    required this.updatedAt,
    required this.version,
  });
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String keyId;
  final String languageId;
  final ProductTextOrigin origin;
  final ProductMessageStatus status;
  final String text;
  final String? translator;
  final DateTime updatedAt;
  final int version;

  factory ProductMessages.fromJson(Map<String, dynamic> json) => _$ProductMessagesFromJson(json);

  Map<String, dynamic> toJson() => _$ProductMessagesToJson(this);
}
